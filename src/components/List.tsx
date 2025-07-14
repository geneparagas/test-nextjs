import React, { ChangeEvent, useEffect, useState } from 'react';
import { Recipe } from './Form';
import styles from '@/styles/List.module.css';

const RecipeList: React.FC<{
  filteredRecipeItems: Recipe[];
  setSelectedItem: (recipe: Recipe | null) => void;
  setView: (view: 'list' | 'add' | 'edit') => void;
  sortOrderTitle: string;
  setSortOrderTitle: (view: 'asc' | 'desc' | 'select') => void;
  sortOrderDate: string;
  setSortOrderDate: (view: 'asc' | 'desc' | 'select') => void;
  sortOrderName: string;
  setSortOrderName: (view: 'asc' | 'desc' | 'select') => void;
  favoriteRecipe: (title: string) => void;
  filterFavorite: '' | 'yes' | 'no';
  setFilterFavorite: (filter: '' | 'yes' | 'no') => void;
  searchText: string;
  setSearchText: (query: string) => void;
  clearFilter: () => void;
  onEdit: (recipe: Recipe) => void;
}> = ({ filteredRecipeItems, setSelectedItem, setView, sortOrderDate, setSortOrderDate, sortOrderName, setSortOrderName, sortOrderTitle, setSortOrderTitle, favoriteRecipe, filterFavorite, setFilterFavorite, searchText, setSearchText, clearFilter, onEdit }) => {

  const formatDate = (date: string) => {
    const dateAdded = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formattedDate: string = dateAdded.toLocaleDateString(undefined, options);

    return formattedDate;
  }
  console.log('filteredRecipeItems', filteredRecipeItems)
  return (
    <div className='container-fluid'>
      <div className='container pt-5'>
        <div className='row'>
          <div className='col-4 px-5'>
            <div className='bg-white shadow-md p-3 mb-3'>
              <div>
                Sort by Title
                <div className='row mt-3'>
                  <div className='col'>
                    <select className='form-select' value={sortOrderTitle} onChange={(e) => { setSortOrderTitle(e.target.value as 'asc' | 'desc' | 'select'); setSortOrderDate('select'); setSortOrderName('select'); }}>
                      <option value='select'>Select</option>
                      <option value='asc'>Asc</option>
                      <option value='desc'>Desc</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white shadow-md p-3 mb-3'>
              <div>
                Sort by Date Added
                <div className='row mt-3'>
                  <div className='col'>
                    <select className='form-select' value={sortOrderDate} onChange={(e) => { setSortOrderDate(e.target.value as 'asc' | 'desc' | 'select'); setSortOrderTitle('select'); setSortOrderName('select'); }}>
                      <option value='select'>Select</option>
                      <option value='asc'>Asc</option>
                      <option value='desc'>Desc</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white shadow-md p-3 mb-3'>
              <div>
                Sort by Name
                <div className='row mt-3'>
                  <div className='col'>
                    <select className='form-select' value={sortOrderName} onChange={(e) => { setSortOrderName(e.target.value as 'asc' | 'desc' | 'select'); setSortOrderTitle('select'); setSortOrderDate('select'); }}>
                      <option value='select'>Select</option>
                      <option value='asc'>Asc</option>
                      <option value='desc'>Desc</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='p-3 bg-white shadow-md mb-3'>
              Favorites
              <div className='mb-2 mt-3 d-flex gap-2'>
                <input className='form-check-input'
                  id='favYes'
                  type='checkbox'
                  name='favoriteRadio'
                  value='yes'
                  checked={filterFavorite === 'yes'}
                  onChange={() => setFilterFavorite('yes')}
                />
                <label htmlFor='favYes'><span className='ml-3 d-inline'>Yes</span></label>
              </div>
              <div className='d-flex gap-2'>
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
          <div className={`col p-3 bg-white position-relative`}>
            <div className='p-3 h-100'>
              <div className={styles.add} onClick={() => setView('add')}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg></div>
              {filteredRecipeItems.length > 0 ? <div className={`row ${styles.listcontainer}`} >
                {(filteredRecipeItems || []).map((recipe: Recipe, i) => (
                  <div key={i} className={`mb-3 pb-3 ${(filteredRecipeItems.length - 1) !== i && styles.recipe}`}>
                    <div className={`row ${styles.recipe_container}`}>
                      <div className='col-4 position-relative p-0 h-100'>
                        <img src={recipe.image} className='w-100 h-100 object-fit-cover' />
                        <span className={styles.favorite} onClick={() => favoriteRecipe(recipe.title)}>{!recipe.isFavorite ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>}</span>
                      </div>
                      <div className={`col p-3 ${styles.listtext}`}>
                        <div className='row h-100' onClick={() => onEdit(recipe)}>
                          <div className='title'><h3>{recipe.title}</h3></div>
                          <div className={styles.desc}><p>{recipe.description}</p></div>
                          <div className='info row mt-auto'>
                            <div className='col'>
                              Added by: {recipe.name}
                            </div>
                            <div className='col text-end'>
                              Date: {formatDate(recipe.dateAdded)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> : <div className='h-100 w-100 d-flex justify-content-center align-items-center'><h1>No record found!</h1></div>}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}


export default RecipeList;