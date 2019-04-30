import React from 'react';

const Filter = props => {
  return (
    <div>
      find countries <input onChange={event => props.setFilter(event.target.value)} value={props.filter} />
    </div>
  )
}

export default Filter