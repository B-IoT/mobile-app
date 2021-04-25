import { AutocompleteEntryModel } from './autocomplete-entry'

describe('AutocompleteEntry', () => {
  it('can be created', () => {
    const instance = AutocompleteEntryModel.create({
      rank: 1,
      name: 'Monsieur Dupont',
    })

    expect(instance).toBeTruthy()
  })

  it('can use action "includesQuery"', () => {
    const instance = AutocompleteEntryModel.create({
      rank: 1,
      name: 'Monsieur Dupont',
    })

    expect(instance.includesQuery('Dupont')).toBeTruthy()
  })
})
