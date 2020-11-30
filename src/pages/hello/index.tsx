import { PageContainer } from '@ant-design/pro-layout'
import { Card } from 'antd'
import React from 'react'
import { useModel } from 'umi'

export default () => {
  const { counter } = useModel("user")
  return (
    <PageContainer>
      <Card>
        <h2>{counter}</h2>
        Hello world
      </Card>
    </PageContainer>
  )
}