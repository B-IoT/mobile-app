import { AutocompleteEntryModel } from './autocomplete-entry'

it('can be created', () => {
  const instance = AutocompleteEntryModel.create({
    rank: 1,
    name: 'Monsieur Dupont',
  })

  expect(instance).toBeTruthy()
})
