import { AnimatePresence as FramerPresence, motion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    visible?: boolean;
    initial?: boolean;
}

const AnimatePresence = ({ children, visible, initial }: Props) => {
    return (
        <FramerPresence initial={initial}>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    {children}
                </motion.div>
            )}
        </FramerPresence>
    );
};

export default AnimatePresence;
