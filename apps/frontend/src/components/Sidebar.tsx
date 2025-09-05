type SideBarProps = {
  onClick: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({onClick}: SideBarProps) {
    return <div style={{paddingTop: "10px"}} className="greyBorder gridContent">
        <div 
            onClick={() => onClick(prev => !prev)}
            style={{textAlign: "center"}}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </div>
    </div>
}