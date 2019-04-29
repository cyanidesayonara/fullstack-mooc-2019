import React from 'react'
import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = props => {

  return (
    props.courses.map(course =>
      <div key={course.name}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  )
}

export default Course