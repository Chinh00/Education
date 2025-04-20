import icon from "@/asssets/images/tlu_icon.png"


const LoadingScreen = () => {
    return <>
        <div className={"w-screen h-screen fixed top-0 left-0"}>
            <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>
                <img src={icon} alt="tlu" className={"scale-25 animate-pulse"}/>
            </div>
        </div>
    </>
}
export default LoadingScreen;