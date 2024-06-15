import React from "react";

const Logout = ({ onLogout }) => {
    return (
        <button className="btn btn-secondary" onClick={onLogout}>
            Logout
        </button>
    );
};

export default Logout;
