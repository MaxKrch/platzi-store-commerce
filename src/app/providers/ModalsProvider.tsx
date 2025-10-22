import { PropsWithChildren } from "react";
import AuthModal from "../components/AuthModal";
import UserModal from "../components/UserModal/UserModal";

const ModalsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return(
        <>  
            <AuthModal />
            <UserModal />
            {children} 
        </>
    );
};

export default ModalsProvider;