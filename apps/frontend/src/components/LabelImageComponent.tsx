export function LabelImageComponent({url, label} : {url: string, label: string}) {    
    return <div style={{padding: "4px", display: "flex", justifyContent: "flex-start", gap: "6px"}}>
        <img
            className="iconStyle" 
            src={url}
        />
        <div style={{color: "white"}}>
            {label}
        </div>
    </div>   
}