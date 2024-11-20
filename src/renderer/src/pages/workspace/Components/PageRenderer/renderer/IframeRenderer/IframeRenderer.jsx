// useCase
// {/*<IframeRenderer*/}
//             {/*  iframeRef={(el) => (iframeRef = el)}*/}
//             {/*  filePath={props.files.html[0]}*/}
//             {/*  onIframeMouseUp={handleMouseUp}*/}
//             {/*  onIframeMouseMove={handleMouseMove}*/}
//             {/*/>*/}
// This iframe ref might create errors with the mouse events going in different windows
//  It can be handled this way on mouse controls
//  on mise down
//    if (iframeRef) iframeRef.style.pointerEvents = 'none'
//     console.log(iframeRef.style.pointerEvents)
//  on mouse up
//     if (iframeRef) iframeRef.style.pointerEvents = 'auto'


const IframeRenderer = (props) => {
  return (
    <iframe
      ref={props.iframeRef}
      onClick={(event) => console.log(event.x, event.y)}
      class="w-full h-full pointer-events-none"
      src={props.filePath}
    />
  )
}

export default IframeRenderer
