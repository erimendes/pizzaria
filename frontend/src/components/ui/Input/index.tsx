import { InputHTMLAttributes, TextareaHTMLAttributes} from 'react'
import styles from './style.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

export function Input({...rest}: InputProps) {
    return(
        <input className={styles.input} {...rest} />
    )
}

export function TextArea({...rest}: TextAreaProps){
    return(
        <textarea className={styles.input} {...TextArea}></textarea>
    )
}
