import { useContext, createContext, useState, useEffect } from "react";

const NodeContext = createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});

export const useNodeContext = () => useContext(NodeContext);

let countdown;

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    return (adjExpirationTime - currentTime);
}

const retrieveLocalStorage = () => {
    const initialToken = localStorage.getItem('token');
    const time = localStorage.getItem('time');

    const remainingTime = calculateRemainingTime(time);

    if (remainingTime <= 6000) {
        localStorage.removeItem('token');
        localStorage.removeItem('time');
        return null;
    }
    return {
        token: initialToken,
        duration: remainingTime
    }
}

export default function Context(props) {
    const dataFromLocalStorage = retrieveLocalStorage();
    let initialToken;
    if (dataFromLocalStorage) initialToken = dataFromLocalStorage.token;
    const [token, setToken] = useState(initialToken);

    const isLoggedIn = !!token;

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('time');

        if (countdown) clearTimeout(countdown);
    }

    const loginHandler = (token, timeRemaining) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('time', timeRemaining);
        const timeLeft = calculateRemainingTime(timeRemaining);
        countdown = setTimeout(logoutHandler, timeLeft);
    }

    useEffect(() => {
        if (dataFromLocalStorage) {
            console.log(dataFromLocalStorage.duration)
            countdown = setTimeout(logoutHandler, dataFromLocalStorage.duration);
        }
    }, [dataFromLocalStorage])


    return (
        <NodeContext.Provider value={{
            token: token,
            isLoggedIn: isLoggedIn,
            login: loginHandler,
            logout: logoutHandler
        }}>
            {props.children}
        </NodeContext.Provider>
    )
}