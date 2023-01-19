import GroupedTask from './GroupedTask/GroupedTask';
import {SlOptionsVertical} from 'react-icons/sl'
import {useState} from 'react'


const OptionsDropDown = () => {
    const [optionsOpen, setOptionOpen] = useState(false);

    return (
        <SlOptionsVertical size='20px' color='gray'
            onClick={() => setOptionOpen(!optionsOpen)}
         />
    );
}

export default OptionsDropDown;