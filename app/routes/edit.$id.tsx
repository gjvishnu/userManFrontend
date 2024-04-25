import Navbar from "~/components/navbar";
import {client} from '../lib/graphQL_client';
import {gql} from 'graphql-request'
import { Form, Link, useLoaderData,redirect } from "@remix-run/react";
import { useState } from "react";
import { useParams } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";



const getSingle = gql`
query GetUserById($id: Int!) {
  userById(id: $id) {
    id
    email
    name
    role
    designation
  }
}
`

export const  loader = async ({ params })=>{

  const { id } = params;


  try{
    const data = await client.request(getSingle,{
      id: parseInt(id)
    })
     return data
  }
  catch(e){
    console.log(e);
    return 'error while fetching all users data'
  }

}

const updateQuery = gql`
mutation update($input: updateUserInput!) {
  updateUser(input: $input) {
    
    email
    name
    role
    designation
  }
}
`

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.formData();
    
const updateData = {
 id : body.get('userId'),
  name :  body.get('name'),
  email : body.get('email'),
  designation : body.get('designation'),
  role : body.get('role')
}

 const updated = await client.request(updateQuery,{
input : updateData

 })
 return redirect("/");
  } catch (error) {
    console.error("An error occurred:", error);
    return 'error while updating'
  }
}


export default function Edit(){

  const loaderData = useLoaderData()
const [name ,setName] = useState(loaderData.userById.name)
const [email ,setEmail] = useState(loaderData.userById.email)
const [role ,setRole] = useState(loaderData.userById.role)
const [designation ,setdesignation] = useState(loaderData.userById.designation)
 



    return(
        <>
        <section className="editMain">
        <div className="my-5">
        <h1 className="text-center my-3 text-2xl">Edit user's Details</h1>

            <Form method="post">
              <div><input onChange={(e)=>setName(e.target.value)} className=" p-2 inputs" type="text" name='name' value={name}/></div>
              <div><input onChange={(e)=>setEmail(e.target.value)} className=" p-2 my-3 inputs" type="email" name='email' value={email}/></div>
              <div>
              <select onChange={(e)=>setdesignation(e.target.value)} value={designation} name='designation' className="p-2 my-3 inputs">
                   <option disabled selected>{designation}</option>
                   <option>Developer</option>
                   <option>Tester</option>
                   <option>designer</option>
                   <option>AWS</option>
                 </select>
              </div>
            <div>  <input type="hidden" name="userId" value={loaderData.userById.id} /></div>

              <div>
              <select onChange={(e)=>setRole(e.target.value)} name="role" value={role} className=" p-2 inputs">
                    <option selected disabled>{role}</option>
                   <option>Admin</option>
                   <option>user</option>
                 </select>
              </div>
              <div><input type="submit" value='update' className="p-2 inputs mt-2"/></div>
            </Form>
        </div>
        </section>
        </>
    )
}