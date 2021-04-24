import React from 'react'
import { render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'
import { Screen } from './screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ScreenPresets } from './screen.presets'

describe('Screen component', () => {
  function buildScreenComponent(preset: ScreenPresets) {
    const screen = (
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <Screen preset={preset} />
      </SafeAreaProvider>
    )

    return screen
  }

  it('should render without scroll', () => {
    const component = render(buildScreenComponent('fixed'))
    expect(component).toBeTruthy()
  })

  it('should match snapshot without scroll', () => {
    const tree = renderer.create(buildScreenComponent('fixed')).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render with scroll', () => {
    const component = render(buildScreenComponent('scroll'))
    expect(component).toBeTruthy()
  })

  it('should match snapshot with scroll', () => {
    const tree = renderer.create(buildScreenComponent('scroll')).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
