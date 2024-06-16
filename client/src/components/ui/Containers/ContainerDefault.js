import React from "react";

const ContainerDefault = props => {
    return (
        <div className={`bg-white p-6 shadow-xl shadow-slate-100 border ${props.className}`} style={props.style}>
            {props.children}
        </div>
    );
}

export default ContainerDefault;
