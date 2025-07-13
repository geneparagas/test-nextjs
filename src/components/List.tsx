import React, { ChangeEvent, useEffect, useState } from 'react';
import { Recipe } from './Form';

const RecipeList: React.FC<{
  filteredRecipeItems: Recipe[];
  setSelectedItem: (recipe: Recipe | null) => void;
  setView: (view: 'list' | 'add' | 'view' | 'edit') => void;
  setSortOrderTitle: (view: 'asc' | 'desc' | 'select') => void;
  favoriteRecipe: (title: string) => void;
}> = ({ filteredRecipeItems, setSelectedItem, setView, setSortOrderTitle, favoriteRecipe }) => {

  console.log('filteredRecipeItems', filteredRecipeItems)
  return (
    <div className='container-fluid'>
      <div className='container pt-5'>
        <div className='row'>
          <div className='col-4 p-3'>
            <div className='bg-white shadow-md p-3'>
              filters
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
          </div>
          <div className='col p-3'>
            <div className='bg-white shadow-md p-3'>
              items
              <div className='row'>
                {filteredRecipeItems.length > 0 ? ((filteredRecipeItems || []).map((recipe: Recipe, i) => (
                  <div key={i} className='border mb-1'>
                    <div onClick={() => { setSelectedItem(recipe), setView('view') }}>
                      {recipe.title}
                      {recipe.name}
                      {recipe.email}
                      {recipe.description}
                      {recipe.ingredients}
                      {recipe.instructions}
                      <img src={recipe.image} className='w-25 h-auto' />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={() => favoriteRecipe(recipe.title)}>{recipe.isFavorite ? 'Remove' : 'Fav'}</button>
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
    </div>
  )
}


export default RecipeList;