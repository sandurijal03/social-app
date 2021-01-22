import { useQuery } from '@apollo/client';
import React from 'react';
import './App.css';
import { GET_POST } from './queries';

const App = () => {
  const { data, loading, error } = useQuery(GET_POST);

  if (loading) return <h4>Loading</h4>;

  if (error) return <h4>Error</h4>;

  return data.getPosts.map((data) => (
    <div key={data._id}>
      <h1>{data.body}</h1>
    </div>
  ));

  // return (
  //   <div>
  //     <h1>Hello World</h1>
  //   </div>
  // );
};

export default App;
