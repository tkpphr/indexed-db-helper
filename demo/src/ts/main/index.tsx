import * as IndexedDBHelper from "indexed-db-helper";
import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

interface Props {
    dbName:string;
    storeName:string;
}

interface State{
    isDeleted:boolean;
    records:{ [key:string]:any } | null;
}

class IndexedDBView extends React.Component<Props,State> {
    private _searchKeyInput:HTMLInputElement|null;
    private _searchValueInput:HTMLInputElement|null;    
    private _putTextInput:HTMLInputElement|null;
    
    constructor(props:Props){
        super(props);
        this.state = {isDeleted:false,records:null};
    }

    async componentDidMount(){
        try{
            this.setState({records:await this.readDatabase()});
        }catch(error){
            console.log(error);
        }
    }

    render(){
        if(this.state.isDeleted){
            return (
                <h1>
                    {this.props.dbName} is Deleted.
                </h1>
            );
        }

        if(this.state.records){
            const recordElements:JSX.Element[] = [];
            const keys=Object.keys(this.state.records);
            for (const key of keys){
                const value=this.state.records[key];
                if(value instanceof ArrayBuffer){
                    const url=URL.createObjectURL(new Blob([new Uint8Array(value as ArrayBuffer)],{type:"image/*"}));
                    recordElements.push(<li key={key}>{key}<div><img src={url}/></div></li>);
                }else{
                    recordElements.push(<li key={key}>{`${key}:${value}`}</li>);
                }
            }
            if(recordElements.length===0){
                recordElements.push(<p key={"no_records"}>No Records.</p>);
            }
            const Menu=styled.div`
                width: 100%;
                height:250px;
                > div:nth-child(1){
                    width:66%;
                    height:100%;
                    float:left;
                    > div:nth-child(1){
                        width:50%;
                        height:100%;
                        float:left;
                        overflow:hidden;
                    }
                    > div:nth-child(2){
                        width:50%;
                        height:100%;
                        float:right;
                        overflow:hidden;
                    }
                }
                > div:nth-child(2){
                    width:33%;
                    height:100%;
                    float:right;
                    overflow:hidden;
                }
            `;
            return (
                <div>
                    <h1>
                        {this.props.dbName} Database
                    </h1>
                    <hr/>
                    <Menu>
                        <div>
                            <div>
                                <h3>Search by</h3>
                                <ul>
                                    <li>
                                        <p>Key</p>
                                        <input type="text" name="key_search" ref={node=>this._searchKeyInput=node}/>
                                        <input type="submit" name="key_search_button" value="search" onClick={this.handleSearchByKey.bind(this)}/>
                                    </li>
                                    <li>
                                        <p>Value</p>
                                        <input type="text" name="value_search" ref={node=>this._searchValueInput=node}/>
                                        <input type="submit" name="value_search_button" value="search" onClick={this.handleSearchByValue.bind(this)}/>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3>Put</h3>
                                <ul>
                                    <li>
                                        <p>Text</p>
                                        <input type="text" name="value_text" ref={node=>this._putTextInput=node}/>
                                        <input type="submit" name="put_text" value="put" onClick={this.handleClickPutText.bind(this)}/>
                                    </li>
                                    <li>
                                        <p>Images</p>
                                        <input type="file" name="value_image" accept="image/*" onChange={this.handleChangeImages.bind(this)} multiple />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3>Delete</h3>
                            <ul>
                                <li>
                                    <input type="submit" name="delete_last_records" value="Last Record" onClick={this.handleClickDeleteLastRecord.bind(this)}/>
                                </li>
                                <li>
                                    <input type="submit" name="delete_image_records" value="Image Records" onClick={this.handleClickDeleteImageRecords.bind(this)}/>
                                </li>
                                <li>
                                    <input type="submit" name="delete_all_records" value="All Record" onClick={this.handleClickDeleteAllRecord.bind(this)}/>
                                </li>
                                <li>
                                    <input type="submit" name="delete_database" value="Database" onClick={this.handleClickDeleteDatabase.bind(this)}/>
                                </li>
                            </ul>
                        </div>
                    </Menu>
                    <hr/>
                    <h2>
                        {this.props.storeName} Records
                    </h2>
                    <ul>
                        {recordElements}
                    </ul>
                </div>
            );
        }else{
            this._searchKeyInput=null;
            this._searchValueInput=null;
            this._putTextInput=null;
            return ( 
                <h1>
                    Loading...
                </h1>
            );
        }
    }

    async handleSearchByKey(){
        if(this._searchKeyInput){
            const key=this._searchKeyInput.value;
            let db:IDBDatabase;
            try {
                
                db=await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
                const record=await IndexedDBHelper.getRecord(db,this.props.storeName,key);
                if(record){
                    if(record instanceof ArrayBuffer){
                        alert(`${key} is Image.`);
                    }else{
                        alert(`${key}:${record}`);
                    }
                }else{
                    alert(`${key} not found.`);
                }
            }catch(error){
                alert(error);
            }finally{
                if(db){
                    db.close();
                }
            }
        }
    }

    async handleSearchByValue(){
        if(this._searchValueInput){
            const searchString=this._searchValueInput.value;
            let db:IDBDatabase;
            try {
                
                db=await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
                const records=await IndexedDBHelper.getRecords(db,this.props.storeName,(_key,value)=>(value===searchString));
                const keys=Object.keys(records);
                if(keys.length===0){
                    alert(`${searchString} not found.`);
                }else{
                    alert(`${keys.length} records found.\n\n${keys.map((key)=>`${key}:${records[key]}\n`).reduce((str,value) => str + value)}`);
                }
            }catch(error){
                alert(error);
            }finally{
                if(db){
                    db.close();
                }
            }
        }
    }

    async handleClickPutText(){
        if(this._putTextInput){
            const value=this._putTextInput.value && this._putTextInput.value!=="" ? this._putTextInput.value : "<Empty Value>"; 
            let db:IDBDatabase;
            try {
                db=await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
                const count=await IndexedDBHelper.getRecordCount(db,this.props.storeName);
                await IndexedDBHelper.putRecord(db,this.props.storeName,`${count}`,value);
                this.setState({records:await this.readDatabase()});
            }catch(error){
                console.log(error);
            }finally{
                if(db){
                    db.close();
                }
            }
        }
    }

    handleChangeImages(event:React.FormEvent<HTMLInputElement>){
        const files=event.currentTarget.files;
        if(files.length===0){
            return;
        }
        this.setState({records:null});
        const reader=new FileReader();
        const images:any[]=[];
        let index=0;
        reader.onload=async ()=>{
            images.push(reader.result);
            index++;
            if(index<files.length){
                reader.readAsArrayBuffer(files.item(index));
            }else{
                let db:IDBDatabase;
                try{
                    db=await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
                    let count=await IndexedDBHelper.getRecordCount(db,this.props.storeName);
                    const imageRecords:{[key:string]:any}={};
                    for(const image of images){
                        imageRecords[`${count++}`]=image;
                    }
                    await IndexedDBHelper.putRecords(db,this.props.storeName,Object.keys(imageRecords),(key)=>imageRecords[key]);
                    this.setState({records:await this.readDatabase()});
                }catch(error){
                    console.log(error);
                }finally{
                    if(db){
                        db.close();
                    }
                }
            }
        }
        reader.readAsArrayBuffer(files.item(index));
    }

    async handleClickDeleteLastRecord(){
        let db:IDBDatabase;
        try {
            db= await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
            const count=await IndexedDBHelper.getRecordCount(db,this.props.storeName);
            await IndexedDBHelper.deleteRecord(db,this.props.storeName,`${count-1}`);
            const records=await this.readDatabase();
            this.setState({records:records});
        }catch(error){
            console.log(error)
        }finally{
            if(db){
                db.close();
            }
        }
    }

    async handleClickDeleteImageRecords(){
        let db:IDBDatabase;
        try {
            this.setState({records:null});
            db= await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
            await IndexedDBHelper.deleteRecords(db,this.props.storeName,(_key,value)=>value instanceof ArrayBuffer);
            const oldRecords=await IndexedDBHelper.getAllRecord(db,this.props.storeName);
            const oldKeys=Object.keys(oldRecords);
            const newRecords:{[key:string]:any}={};
            oldKeys.forEach((key,index)=>newRecords[`${index}`]=oldRecords[key]);
            await IndexedDBHelper.deleteAllRecord(db,this.props.storeName);
            await IndexedDBHelper.putRecords(db,this.props.storeName,Object.keys(newRecords),(key)=>newRecords[key]);
            this.setState({records:await this.readDatabase()});
        }catch(error){
            console.log(error)
        }finally{
            if(db){
                db.close();
            }
        }
    }

    async handleClickDeleteAllRecord(){
        let db:IDBDatabase;
        try {
            db= await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
            await IndexedDBHelper.deleteAllRecord(db,this.props.storeName);
            const records=await this.readDatabase;
            this.setState({records:records});
        }catch(error){
            console.log(error)
        }finally{
            if(db){
                db.close();
            }
        }
    }

    async handleClickDeleteDatabase(){
        try {
            this.setState({records:null})
            await IndexedDBHelper.deleteDatabase(this.props.dbName)
            this.setState({isDeleted:true});
        }catch(error){
            console.log(error);
        }
    }

    async readDatabase(){
        let db:IDBDatabase;
        try {
            db=await IndexedDBHelper.openDatabase(this.props.dbName,[this.props.storeName]);
            return await IndexedDBHelper.getAllRecord(db,this.props.storeName); 
        }catch(error){
            throw error;
        }finally{
            if(db){
                db.close();
            }
        }
    }

}

ReactDOM.render(<IndexedDBView dbName={"Example"} storeName={"Store"}/>,document.getElementById("view"));

