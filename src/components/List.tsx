import React, { useEffect, useState } from 'react';
import { Recipe } from './Form';

const RecipeList: React.FC<{ recipeItems: Recipe[]; setSelectedItem: (recipe: Recipe | null) => void; setView: (view: 'list' | 'add' | 'view' | 'edit') => void; }> = ({ recipeItems, setSelectedItem, setView }) => (
  <div className='container-fluid'>
    <div className='container pt-5'>
      <div className='row'>
        <div className='col-4 p-3'>
          <div className='bg-white shadow-md p-3'>
            filters
          </div>
        </div>
        <div className='col p-3'>
          <div className='bg-white shadow-md p-3'>
            items
            <div className='row'>
              {recipeItems.map(rec => (
                <div className='border mb-1' onClick={() => { setSelectedItem(rec), setView('view') }}>{rec.title} - {rec.name}</div>
              ))}
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


export default RecipeList;