import React from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import { WebviewWindow } from '@tauri-apps/api/window';
import { useNavigate } from 'react-router-dom';
import { createWin } from '@/windows/action';
export default function Home() {
  const navigate = useNavigate();
  const skipRoute = async () => {
    navigate('/about');
  };

  const invokeHello = async () => {
    invoke('hello')
  }

  const invokeMsg = async () => {
    invoke('msg',{message:'hello msg'})
  }

  const invokeReturnData = async () => {
    invoke('returndata',{data:'hello returnData'})
  .then((res)=>{
    console.log('😄res:',res)
  })
  }

  const invokeGetUser = async (name: String, age: Number) => {
    invoke('get_person',{name,age}).then((res)=>{
      console.log('😄resPerson:',res)
    })
  }

  const openAbout = async () => {
    const webview=new WebviewWindow('about2',{
      url:'/about',
      title:'about2',
      width:800,
      height:600,
    })
    webview.once('tauri://created',()=>{
      alert('😄webview created')
    })
    webview.once('tauri://error',()=>{
      alert('😄webview error')
    })
    // 与这个窗口通信
    webview.once('tauri://message',()=>{
      alert('😄webview message')
    })
  }

  const closeAbout = async (label:string) => {
    const win=WebviewWindow.getByLabel(label)
    win?.close();
  }

  const openPomodor = async () => {
    const pomoderWin=WebviewWindow.getByLabel('Pomodor')
    if(pomoderWin){
      pomoderWin.close();
      return
    }
    new WebviewWindow('Pomodor',{
      url:'/pomodor',
      title:'Pomodor',
      width:300,
      height:350,
      alwaysOnTop:true,
      
      resizable:false,
      transparent:true,
      x:0,
      y:0,
    })
  }
  return (
    <div>
      <div>
        <div>
          <button className='bg-blue-300' onClick={skipRoute}>About</button>
          <button onClick={invokeHello}>InvokeHello</button>
          <button onClick={invokeMsg}>InvokeMessage</button>
          <button onClick={invokeReturnData}>InvokeReturn</button>
          <button onClick={()=>invokeGetUser('log',97)}>InvokeGetuser</button>
          <button onClick={()=>invoke('open_about')}>open_about</button>
          <button onClick={openAbout}>openAboutWindow</button>
          <button onClick={()=>closeAbout('about2')}>closeAboutWindow</button>
          <button onClick={openPomodor}>番茄钟</button>
        </div>
      </div>
    </div>
  );
}
