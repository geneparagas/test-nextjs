import React, { ChangeEvent, useEffect, useState } from 'react';
import { Recipe } from './Form';

const RecipeList: React.FC<{
  filteredRecipeItems: Recipe[];
  setSelectedItem: (recipe: Recipe | null) => void;
  setView: (view: 'list' | 'add' | 'edit') => void;
  setSortOrderTitle: (view: 'asc' | 'desc' | 'select') => void;
  favoriteRecipe: (title: string) => void;
  filterFavorite: '' | 'yes' | 'no';
  setFilterFavorite: (filter: '' | 'yes' | 'no') => void;
  searchText: string;
  setSearchText: (query: string) => void;
  clearFilter: () => void;
  onEdit: (recipe: Recipe) => void;
}> = ({ filteredRecipeItems, setSelectedItem, setView, setSortOrderTitle, favoriteRecipe, filterFavorite, setFilterFavorite, searchText, setSearchText, clearFilter, onEdit }) => {

  console.log('filteredRecipeItems', filteredRecipeItems)
  return (
    <div className='container-fluid'>
      <div className='container pt-5'>
        <div className='row'>
          <div className='col-4 px-5'>
            <div className='bg-white shadow-md p-3 mb-3'>
              Sort by title {searchText}
              <div className='row'>
                <div className='col'>
                  <select className='form-select' onChange={(e) => setSortOrderTitle(e.target.value as 'asc' | 'desc' | 'select')}>
                    <option value='none'>Select</option>
                    <option value='asc'>Asc</option>
                    <option value='desc'>Desc</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='p-3 bg-white shadow-md mb-3'>
              Favorites
              <div className='mb-2'>
                <input className='form-check-input'
                  id='favYes'
                  type='checkbox'
                  name='favoriteRadio'
                  value='yes'
                  checked={filterFavorite === 'yes'}
                  onChange={() => setFilterFavorite('yes')}
                />
                <label htmlFor='favYes'>Yes</label>
              </div>
              <div className='mb-2'>
                <input className='form-check-input'
                  id='favNo'
                  type='checkbox'
                  name='favoriteRadio'
                  value='no'
                  checked={filterFavorite === 'no'}
                  onChange={() => setFilterFavorite('no')}
                />
                <label htmlFor='favNo'>No</label>
              </div>
            </div>
            <div className='p-3 bg-white shadow-md'>
              <button type="button" className="btn btn-primary" onClick={() => clearFilter()}>Clear filter</button>
            </div>
          </div>
          <div className='col p-5 bg-white'>
            <div className=' shadow-md p-3'>
              <div className='row'>
                {filteredRecipeItems.length > 0 ? ((filteredRecipeItems || []).map((recipe: Recipe, i) => (
                  <div key={i} className='border mb-3'>


                    <div className='row'>
                      <div className='col-3 position-relative'>
                        <img src={recipe.image} className='w-100 h-auto' />
                        <button type="button" className="btn btn-primary position-absolute start-0" onClick={() => favoriteRecipe(recipe.title)}>{recipe.isFavorite ? 'Remove' : 'Fav'}</button>
                      </div>
                      <div className='col p-3'>
                        <div onClick={() => onEdit(recipe)}>
                          <div className='title'><h3>{recipe.title}</h3></div>
                          <div className='desc'><p>{recipe.description}</p></div>
                          <div className='info row'>
                            <div className='col'>
                              <p>Added by: {recipe.name}</p>
                            </div>
                            <div className='col'>
                              <p>{recipe.dateAdded}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                ) : <div>sanew</div>}
              </div>
            </div>
          </div>
        </div>
        <div className='p-3'>
          <button type="button" className="btn btn-primary" onClick={() => setView('add')}>Add</button>
        </div>
      </div>
    </div >
  )
}


export default RecipeList;