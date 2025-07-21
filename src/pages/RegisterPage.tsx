import { useSearchParams, useNavigate } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";


const RegisterPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const phone = searchParams.get("phone") ?? "";

    return (
        <div>
            <AuthWrapper
                mode="register"
                phoneProp={phone}
                onClose={() => navigate("/")}
                onSuccess={(user, token) => {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    navigate("/");
                }}
            />
        </div>
    );
};

export default RegisterPage;