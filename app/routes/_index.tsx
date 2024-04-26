import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import {client} from '../lib/graphQL_client';
import {gql} from 'graphql-request'
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";



export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const getALlUsers = gql`
query{
  allUsers {
    id
    name
    email
    role
    designation
  }
}
`
const deleteQurie = gql`
mutation DeleteUser($input: deleteUserInput!) {
  deleteUser(input: $input) {
    id 
  }
}
`

 export const  loader = async ()=>{
  try{
    const data = await client.request(getALlUsers)
     return data
  }
  catch(e){
    console.log(e);
    return 'error while fetching all users data'
  }
  
}

export async function action({ request }: ActionFunctionArgs) {

  const body = await request.formData()
  const iD = body.get('userId')


  try{
    await client.request(deleteQurie,{
      input : {
        id : parseInt(iD)
      }
    })
    return 'done'
     }
   catch(e){
  console.log(e);
  return 'error'
   }
}

export default function Index() {
 const loaderData =  useLoaderData()
  
  return (
    <>
    <Navbar/>

<div className="userTableMain container mx-auto mt-5   px-5">
 <Link to={'/create'}> <button className="bg-blue-500 hover:bg-blue-700 my-5  text-white font-bold py-2 px-4 rounded">
  Add user
</button> </Link>
<table>
    <thead>
        <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Name</th>
            <th className="text-center">Email</th>
            <th className="text-center">Role</th>
            <th className="text-center">Designation</th>
            <th className="text-center">Action</th>

        </tr>
    </thead>
    <tbody>
      {loaderData && loaderData.allUsers.map(data=>(
            <tr key={data.id}>
            <td key={data.id} className="text-center">{data.id}</td>
            <td key={data.id} className="text-center">{data.name}</td>
            <td key={data.id} className="text-center">{data.email}</td>
            <td key={data.id} className="text-center">{data.role}</td>
            <td key={data.id} className="text-center">{data.designation}</td>
            <td key={data.id} className="text-center"><Link to={`/edit/${data.id}`}>Edit</Link> & <Form method="post"> <input type="hidden" name="userId" value={data.id}/><button type="submit">Delete</button> </Form></td>
        </tr>
      ))}
        
         
     </tbody>
</table>
 </div>

    </>
  );
}
