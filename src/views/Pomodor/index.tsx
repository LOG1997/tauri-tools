import React, { useEffect, useState, useRef } from 'react';
import { dialog } from '@tauri-apps/api';
type Props = {
  timer: number;
  timeType: TimeType;
  isPlaying: boolean;
  changeTimeType: (value:any) => void;
}
type TimeType= 'work' | 'break'|'longBreak';
const CountDown = ({
  timer,
  timeType,
  isPlaying,
  changeTimeType
}:Props) => {
  const [timerId, setTimerId] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState(timer);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const time_minute:string = Math.floor(remainingTime / 60)<=0?'00':Math.floor(remainingTime / 60)<10?'0'+Math.floor(remainingTime / 60).toString():Math.floor(remainingTime / 60).toString();
  const time_seconde:string = remainingTime % 60 <=0?'00':remainingTime % 60 < 10 ? '0' + (remainingTime % 60).toString() : (remainingTime % 60).toString();
  let tipText = '未开始';
  if(isPlaying){
    if(timeType==='work'){
      tipText = '专注中';
    }
    else if(timeType==='break'){
      tipText = '休息中';
    }
  }
  function drawCircle(
    ctx: any,
    width: number,
    height: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise: boolean,
    colorType: TimeType
  ) {
    const colorBack= colorType==='work'?'#22c55e':colorType==='break'?'#70F3F8':'#F87070';
    const colorFront= colorType==='work'?'#dca441':colorType==='break'?'#65402c':'#65402c';
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, (3 * Math.PI) / 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = colorBack
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, counterclockwise);
    ctx.lineWidth = 10;
    ctx.strokeStyle = colorFront;
    ctx.stroke();
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (timerId) {
      clearInterval(timerId);
    }
    if (!canvas || !ctx) {
      return;
    }
    if (timer <= 0) {
      setRemainingTime(0);
      return;
    } else {
      setRemainingTime(timer);
      console.log('😉timer:',timer)
    }
    const radius = 80;
    const startAngle = -Math.PI / 2;
    let endAngle = (3 * Math.PI) / 2;
    drawCircle(ctx, 200, 200, radius, startAngle, endAngle, false,timeType);
    const id = isPlaying
      ? setInterval(() => {
          endAngle = endAngle - (2 * Math.PI) / timer;
          drawCircle(ctx, 200, 200, radius, startAngle, endAngle, false,timeType);
          setRemainingTime((remainingTime) => remainingTime - 1);
        }, 1000)
      : null;
    setTimerId(id);
    return () => {
      if (id) clearInterval(id);
    };
  }, [timer, isPlaying,timeType]);

  useEffect(() => {
    if(timerId&&remainingTime <= 0) {
      if(timeType==='work'){
        changeTimeType('break');
      }
      else if(timeType==='break'){
        changeTimeType('longBreak');
      }
      clearInterval(timerId);
    }
  },[remainingTime])
  return (
    <div className="relative">
      <canvas
        id="canvasCountdown"
        width="200"
        height="200"
        ref={canvasRef}
      ></canvas>
      <div className="timer_container flex flex-wrap justify-center gap-1 text-4xl absolute top-13 left-2">
        <div className="timer_minute">
        {time_minute}
        </div>
        :
        <div className="timer_seconde">
        {time_seconde}
        </div>
        <div className='text-3xl'>{tipText}</div>
      </div>
    </div>
  );
};

export default function Pomodor() {
  const [timer, setTimer] = useState(0);
  const [time_work, setTime_work] = useState('25');
  const [timer_break, setTimer_break] = useState('5');
  const [count, setCount] = useState(0);
  const [timeType, setTimeType] = useState<TimeType>('work');
  const [isPlaying, setIsPlaying] = useState(false);
  const handleChangeWorkTime = (e: any) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setTime_work(value);
  };

  const handleChangeBreakTime = (e: any) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setTimer_break(value);
  };

  const startPomodor = () => {
    if (timer == 0) return;
    setIsPlaying(true);
  };

  const stopPomodor = () => {
    if (timer == 0) return;
    dialog
    .ask('是否要停止当前番茄钟')
    .then((response) => {
      console.log('😐response:',response)
      if (response === true) {
        // 用户点击了确定按钮
        // 执行操作
    console.log('😑stopPomodor:', timer);
    setIsPlaying(false);
    setTimeType('work');
    setTimer(parseInt(time_work) * 60);
      } 
    });

  };
// 改变类型
  const changeTimeType = (value:TimeType) => {
    console.log('😌value:',value)
    if(value==='work'){
      setTimer(parseInt(time_work) * 60);
      setTimeType('work');
    }else if(value==='break'){
      setTimeType('break');
      setTimer(parseInt(timer_break) * 60);
    }
    else {
      setCount(count + 1);
      setTimer(parseInt(time_work) * 60);
      setTimeType('work');
      setIsPlaying(false);
    }
  }
  useEffect(() => {
    setTimer(parseInt(time_work) * 60);
  },[time_work,timer_break])
  return (
    <div className="bg-transparent">
      <div className="flex justify-center">
        <CountDown timer={timer} timeType={timeType} isPlaying={isPlaying} changeTimeType={changeTimeType} />
      </div>
      <div className="timer_setting flex justify-center text-center">
        <div>
          <div>work</div>
          <input
            className="bg-gray-200/30 w-12"
            disabled={isPlaying}
            type="text"
            value={time_work}
            onChange={handleChangeWorkTime}
            onFocus={() => {
              if (time_work === '00') setTime_work('');
            }}
            onBlur={() => {
              if (!time_work) setTime_work('00');
            }}
          />
        </div>
        <div>
          <div>break</div>
          <input
            className="bg-gray-200/30 w-12"
            disabled={isPlaying}
            type="text"
            value={timer_break}
            onChange={handleChangeBreakTime}
            onFocus={() => {
              if (timer_break === '00') setTimer_break('');
            }}
            onBlur={() => {
              if (!timer_break) setTimer_break('00');
            }}
          />
        </div>
        <div>
          <div className="i-noto-tomato"></div>
          <input
            className="bg-gray-200/30 w-12"
            disabled={true}
            type="text"
            value={count}
          />
        </div>
      </div>
      <div className="timer_button flex justify-center">
        {isPlaying ? (
          <button onClick={stopPomodor}>
            <div className="i-ic-baseline-free-breakfast text-red-500"></div>
          </button>
        ) : (
          <button onClick={startPomodor}>
            <div className="i-ic-baseline-not-started text-green-500"></div>
          </button>
        )}
      </div>
    </div>
  );
}
