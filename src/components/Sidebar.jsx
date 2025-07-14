import logo from '../assets/logonew.svg';
const Sidebar = () => {
    return (
        <div className="w-full h-full bg-[#202b3b] rounded-3xl">
            <img  className= " p-2 h-[100px] w-[100px]" src={logo} alt="Logo"></img>
        </div>
    );
};

export default Sidebar;