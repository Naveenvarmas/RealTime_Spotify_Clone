import { Outlet } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar"
import { useState, useRef, useCallback, useEffect } from "react"
import FriendsActivity from "./components/FriendsActivity"
import AudioPlayer from "./components/AudioPlayer"
import PlaybackControls from "@/layout/components/PlaybackControls"

const MainLayout = () => {
   
  const [isMobile,setIsMobile]=useState(false);

  useEffect(()=>{
    const checkMobile =  () => {
      setIsMobile(window.innerWidth<700);
    }
    checkMobile();
    window.addEventListener("resize",checkMobile);
    return () => window.removeEventListener("resize",checkMobile);
  })

  

  const [leftWidth, setLeftWidth] = useState(300)
  const [rightWidth, setRightWidth] = useState(250)
  const isDraggingLeft = useRef(false)
  const isDraggingRight = useRef(false)

  const handleLeftDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingLeft.current = true

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingLeft.current) return
      setLeftWidth(Math.min(Math.max(e.clientX, 100), 500))
    }

    const onMouseUp = () => {
      isDraggingLeft.current = false
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }, [])

  const handleRightDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRight.current = true

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRight.current) return
      const newWidth = window.innerWidth - e.clientX
      setRightWidth(Math.min(Math.max(newWidth, 100), 400))
    }

    const onMouseUp = () => {
      isDraggingRight.current = false
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }, [])

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
       <AudioPlayer />
        {/* left sidebar */}
        <div style={{ width: leftWidth }} className="shrink-0 overflow-hidden">
          <LeftSideBar />
        </div>

        {/* left drag handle */}
        <div
          onMouseDown={handleLeftDrag}
          className="w-1 bg-zinc-800 hover:bg-zinc-500 cursor-col-resize transition-colors shrink-0"
        />

        {/* main content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>

        {/* right drag handle */}
       {!isMobile && (
  <div
    onMouseDown={handleRightDrag}
    className="w-1 bg-zinc-800 hover:bg-zinc-500 cursor-col-resize transition-colors shrink-0"
  />
)}

        {/* right sidebar */}
        {!isMobile && (
  <div style={{ width: rightWidth }} className="shrink-0 overflow-hidden">
    <FriendsActivity />
  </div>

        )}
      </div>
      
      <PlaybackControls />
    </div>
  )
}

export default MainLayout