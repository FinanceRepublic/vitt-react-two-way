import React, { useEffect, useState,useRef } from 'react'
import {useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import '../css/homepage.css'
import logo from '../assets/logo.png';

export default function HomePage() {
   const [link,setLink] = useState('')
   const [mobile,setMobile] = useState<string|number>('')
   const [loading,setLoading] = useState<boolean>(false)
   const [joiningLink,setJoiningLink] = useState<string>('')
   const ref = useRef<any>(null)
   //const navigate  =useNavigate()

   async function newMeeting(){
     //  let mobile= '8708213235'
     if(mobile ==='')
     return ;
     console.log(mobile)
       let roomId = uuidv4()
        let custId =uuidv4();


        //add roomId as local storage in the browser 
        if(localStorage.getItem('created_by_admin') !=null){
            let d = new Date()
            let storedArr = localStorage.getItem('created_by_admin')
            //@ts-ignore
            let tempArr = JSON.parse(storedArr)
            tempArr.push( {id:roomId,time:d.getTime()} )
            //console.log(tempArr)
            
            //add links to browser
            localStorage.setItem('created_by_admin',JSON.stringify(tempArr));
            
        }
        else{
            //if creating link first time
            let d = new Date()
            localStorage.setItem('created_by_admin',JSON.stringify([{id:roomId,time:d.getTime()}]))
        }

        //verifying mobile number 
       await fetch('https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/fetch-customerid',{
        method:'POST',
        headers:{
            'Accept':'application.json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify({mobileno:mobile}),
        cache:'default'
        }).then((res)=>{
            return res.json()
        }).then(result=>{
            console.log('i am value',result)
            if(result.custid===null)
            return ;
            else custId = result.custid;

        }).catch((err)=>{
            console.log('error in verifying mobile',err)
            //meetingBtn.disabled = false
        })

        setLink(`${window.location.protocol}//${window.location.host}/meeting.html?room_id=${roomId}&cust_id=${custId}&mob=${mobile}`)
   }

   function join(){
       if(joiningLink==='')
       return ;
      // window.location.replace(joiningLink)
      //console.log(location.href)
       // window.location= joiningLink
       let tempArr=joiningLink.split('#')
       console.log(tempArr)
       window.location.href= tempArr[1]
   }
   async function handleCopyToClipboard(){
    if(link ==='' || ref.current===null)
    return ;

    if(navigator.clipboard)
    console.log("clipboard available")

    ref.current.select();
    ref.current.setSelectionRange(0,99999);
    console.log("handle copy fn",ref.current.value);
    await navigator.clipboard.writeText(ref.current.value);

    alert("Copied link")
   }
   useEffect(()=>{

   },[])

   
  return (
    // <div>HomePage
    //     <button onClick={()=>newMeeting()}>new meeting</button>
    //     <p>{link}</p>
    // </div>
    <>
    <header >
        <img src={logo}/>
    </header>
    <div className="flex-container">
        <div className='flex-child1'>
            <h1>Vitt Video Chat App</h1>
            <div className="options">
                <div className='input-wrapper'>
                    <input                     
                        type="tel" 
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        name="phone"
                        className="client-mob"
                        placeholder="User Code" 
                        value={mobile}
                        onChange={(e)=>setMobile(e.target.value)}
                        
                    /> 
                </div>
                <button 
                    id="newMeeting" 
                    className="btn" 
                    onClick={()=>newMeeting()} >
                        meeting link
                </button>
                <br/> 
            </div>
            <div className='options'>
                <textarea 
                    rows={7} 
                    value={link} 
                    //@ts-ignore
                    onClick={()=>handleCopyToClipboard(link)} 
                    ref = {ref}
                    onChange={()=>null}
                >
                </textarea>
            </div>
            <p>Or</p>
            <div className='options'>
                <div className='input-wrapper'>
                    <input 
                        type="text" 
                        id="meetingInput" 
                        value={joiningLink} 
                        placeholder="Enter link here"
                        onChange={(e)=>setJoiningLink(e.target.value)}
                    />
                </div>
                 
                <button id="join" className="btn" onClick={()=>join()}>join</button>
                
            </div>
        </div>
        <div className="images">
            <img style={{display:"none"}} src="https://media.istockphoto.com/photos/african-american-customer-woman-talking-to-support-service-employee-picture-id1355302972?b=1&k=20&m=1355302972&s=170667a&w=0&h=Hqyu97HPCdr7P3qu1TfCCVuzWZb5vLtUV7By-bwWzA8="/>
            <img style={{display:"none"}} src="https://media.istockphoto.com/photos/business-team-in-video-conference-picture-id1410142294?b=1&k=20&m=1410142294&s=170667a&w=0&h=l3pHf2oCpdhVWUkSCD8QJMMiO167augTs7T41TY8ZaU="/>
            <img style={{display: "none"}} src="https://images.unsplash.com/photo-1616587894289-86480e533129?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"/>
            <img src="https://cdn.pixabay.com/photo/2020/09/25/10/10/education-5600987_960_720.png"/>
        </div>
    </div>
    </>
  )
}
