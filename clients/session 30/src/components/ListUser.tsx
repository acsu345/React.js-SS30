import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface User{
    id: number
    name: string
    email: string
}
export default function ListUser() { 
    const [user, setUser] = useState<User[]>([])
    const fetchUser = async ():Promise <void> => {
        try{
            const response = await axios.get<User[]>("  http://localhost:8080/users")
            console.log(response.data);
            setUser(response.data)
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])
    const handleAdd = async (): Promise <void> =>{
        try{
            const response = await axios.post<User[]> ("http://localhost:8080/users", {
                name:"Nguyen thi b",
                email:"ntb@gmail.com"
            })
            if(response.status === 201){
                alert("Them nguoi dung moi thanh cong")
                fetchUser()
            }
        }catch(error){
            console.log("error", error);
        }
    }
  return (
   <></>
  )
}
