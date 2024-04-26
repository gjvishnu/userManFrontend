import type { ActionFunctionArgs } from "@remix-run/node";
import { Form ,  redirect} from "@remix-run/react";
import { gql } from "graphql-request"
import { useState } from "react"
import { client } from "~/lib/graphQL_client";

const createQuery = gql`
mutation CreateUser($input: createUserInput!) {
    createUser(input: $input) {
      email
      name
      role
      designation
    }
  }
`

export async function action({request,}: ActionFunctionArgs) {

try{
    const body = await request.formData();
   const createData = {
    name : body.get('name'),
    email : body.get('email'),
    role : body.get('role'),
    designation : body.get('designation')

   }
const newUser = await client.request(createQuery,{
    input : createData
})
 
return  redirect("/");
}
catch(e){
    console.log(e);
    return 'error creating user'
    
}

  }

export default function Create(){

     const [name ,setName] = useState('')
    const [email ,setEmail] = useState('')
    const [role ,setRole] = useState('')
    const [designation ,setdesignation] = useState('')

    return(
        <>
                   <section className="editMain">
                   <div className="my-5">
                   <h1 className="text-center my-3 text-2xl">Create User</h1>
        
                       <Form method="post">
                         <div><input onChange={(e)=>setName(e.target.value)} className=" p-2 inputs" type="text" name='name' placeholder="name" /></div>
                         <div><input onChange={(e)=>setEmail(e.target.value)} className=" p-2 my-2 inputs" type="email" name='email' placeholder="email" /></div>
                         <div>
                         <select onChange={(e)=>setdesignation(e.target.value)} name='designation' className="p-2 my-2 inputs">
                              <option disabled selected>Select desigination</option>
                              <option>Developer</option>
                              <option>Tester</option>
                              <option>designer</option>
                              <option>AWS</option>
                            </select>
                         </div>
                         <div>
                         <select onChange={(e)=>setRole(e.target.value)} name="role" className=" p-2 inputs">
                               <option selected disabled>Select role</option>
                              <option>Admin</option>
                              <option>user</option>
                            </select>
                         </div>
                         <div><input type="submit" value='create' className="p-2 inputs submitInpt mt-2"/></div>
                       </Form>
                   </div>
                   </section>
                   </>
    )
}