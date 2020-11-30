import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card } from 'antd';
import { useModel } from 'umi';


export default (): React.ReactNode => {
  const { counter, increment, decrement } = useModel("user");

  useEffect(() => {
    setTimeout(() => {
      increment()
    }, 1000)
  }, [])

  return (
    <PageContainer>
      <Card>
        <h1>hello</h1>
        <p>{counter}</p>
        <Button onClick={increment}>+</Button>
        <Button onClick={decrement}>-</Button>
      </Card>
    </PageContainer>
  )
}
