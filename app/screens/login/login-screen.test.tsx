import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import renderer from 'react-test-renderer'
import { LoginScreen } from './login-screen'

describe('Login screen', () => {
  test('e', async () => {
    const { findByText } = render(<LoginScreen />)

    const email = await findByText('Email')

    expect(email).toBeTruthy()
  })

  test('snapshot', () => {
    const tree = renderer.create(<LoginScreen />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
