import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/navbar";
import {client} from '../lib/graphQL_client';
import {gql} from 'graphql-request'
import { Link, useLoaderData } from "@remix-run/react";

 
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

export default function Index() {
 const loaderData =  useLoaderData()

  return (
    <>
    <Navbar/>

<div className="userTableMain container mx-auto mt-5   px-5">
 <button className="bg-blue-500 hover:bg-blue-700 my-5  text-white font-bold py-2 px-4 rounded">
  Add user
</button> 
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
      {loaderData && loaderData.allUsers.map(e=>(
        <tr key={e.id}>
            <td key={e.id} className="text-center">{e.id}</td>
            <td  key={e.id} className="text-center">{e.name}</td>
            <td  key={e.id} className="text-center">{e.email}</td>
            <td key={e.id} className="text-center">{e.role}</td>
            <td key={e.id} className="text-center">{e.designation}</td>
            <td key={e.id} className="text-center"><Link to={`/edit/${e.id}`}>Edit</Link> & <Link>Delete</Link></td>
        </tr>
      ))}
        
         
     </tbody>
</table>
 </div>

    </>
  );
}
