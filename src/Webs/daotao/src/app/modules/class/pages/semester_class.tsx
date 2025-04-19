import { useParams } from "react-router";

export type SemesterClassProps = {

}

const SemesterClass = () => {
    const { id } = useParams();
    console.log(id)
    return (
        <>Danh kì học</>
    )
}

export default SemesterClass