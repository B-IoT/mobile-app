import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const CategoryModel = types.model('Category').props({
  id: types.identifierNumber,
  name: types.string,
})

type CategoryType = Instance<typeof CategoryModel>
/**
 * An item category.
 */
export interface Category extends CategoryType {}
type CategorySnapshotType = SnapshotOut<typeof CategoryModel>
export interface CategorySnapshot extends CategorySnapshotType {}
export const createCategoryDefaultModel = () => types.optional(CategoryModel, {})
