import React, { useState } from "react"

const useToggle = (initialVal = true) => {
    const [value, setValue] = useState(initialVal);
    const toggle = () => {
        setValue(oldValue => !oldValue);
    }
    return [value, toggle];
}

export {useToggle};