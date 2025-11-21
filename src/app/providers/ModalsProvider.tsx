import { PropsWithChildren } from "react";
import AuthModal from "../components/AuthModal";

const ModalsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return(
        <>  
            <AuthModal />
            {children} 
        </>
    );
};

export default ModalsProvider;