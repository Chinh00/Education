import TluIcon from "@/assets/icons/tlu_icon.png"

const LoadingScreen = () => {
    return <>
        <div className={"w-screen h-screen"}>
            <div className={"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>
                <img src={TluIcon} alt="tlu" className={"scale-25 animate-pulse"}/>
            </div>
        </div>
    </>
}
export default LoadingScreen;