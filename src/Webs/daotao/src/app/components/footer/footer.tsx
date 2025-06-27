import {motion} from "framer-motion";

const Footer = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            className="mt-16 text-center text-sm text-white/60"
        >
            <p>
                &copy; {new Date().getFullYear()} Học Vấn Tương Lai. Tất cả các quyền được bảo lưu.
            </p>
        </motion.div>
    )
}
export default Footer