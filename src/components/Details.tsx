import React, { useEffect, useState } from 'react';
import { Recipe } from './Form';

const RecipeForm: React.FC<{recipe: Recipe; onEdit: (recipe: Recipe) => void; onDelete: (name: string) => void;}> = ({recipe, onEdit, onDelete}) => (
      <div className='container-fluid'>
          <div className='row justify-content-center'>
            <div className='col bg-white shadow-md p-3'>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <div>{recipe.name}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Title</label>
                    <div>{recipe.title}</div>
                </div>
                <button type="submit" className="btn btn-primary ml-3" onClick={() => onEdit(recipe)}>Edit</button>
                <button type="submit" className="btn btn-danger" onClick={() => onDelete(recipe.name)}>Delete</button>
            </div>
          </div>
        </div>
  )

  export default RecipeForm;