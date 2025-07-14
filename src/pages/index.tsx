import React, { useEffect, useState, useMemo } from 'react';
import Head from 'next/head'
import RecipeForm, { Recipe } from '@/components/Form';
import RecipeList from '@/components/List';
import styles from '@/styles/Home.module.css'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [recipeItems, setRecipeItems] = useState<Recipe[]>([]);

  const [selectedItem, setSelectedItem] = useState<Recipe | null>(null);
  const [sortOrderTitle, setSortOrderTitle] = useState<'asc' | 'desc' | 'select'>('select');
  const [sortOrderDate, setSortOrderDate] = useState<'asc' | 'desc' | 'select'>('select');
  const [sortOrderName, setSortOrderName] = useState<'asc' | 'desc' | 'select'>('select');
  const [filterFavorite, setFilterFavorite] = useState<'' | 'yes' | 'no'>('');
  const [searchText, setSearchText] = useState<string>('');

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    if (recipeItems.length === 0) return

    localStorage.setItem('recipes', JSON.stringify(recipeItems))
  }, [recipeItems]);

  useEffect(() => {
    const storeData = localStorage.getItem('recipes');

    console.log('storeData', storeData)

    const value = storeData ? JSON.parse(storeData) : [
      {
        "name": "gene",
        "title": "adobo",
        "image": "/images/adobo.jpg",
        "email": "email@gene.com",
        "description": "popular dish",
        "ingredients": "baboy, toyo, suka, bawang",
        "instructions": "pakuluan",
        "dateAdded": "2025-07-13T23:31:50.493Z",
        "isFavorite": false
      }
    ]

    setRecipeItems(value);
  }, []);

  const filteredRecipeItems = useMemo(() => {
    let currentRecipes: Recipe[] = [...recipeItems];

    console.log('searchText', searchText)

    if (searchText) {
      currentRecipes = currentRecipes.filter((recipe: Recipe) =>
        recipe.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterFavorite === 'yes') {
      currentRecipes = currentRecipes.filter((recipe: Recipe) => recipe.isFavorite);
    } else if (filterFavorite === 'no') {
      currentRecipes = currentRecipes.filter((recipe: Recipe) => !recipe.isFavorite);
    }

    if (sortOrderTitle === 'asc') {
      currentRecipes.sort((a: Recipe, b: Recipe) => a.title.localeCompare(b.title));
    } else if (sortOrderTitle === 'desc') {
      currentRecipes.sort((a: Recipe, b: Recipe) => b.title.localeCompare(a.title));
    } 
    
    if (sortOrderDate === 'asc') {
      currentRecipes.sort((a: Recipe, b: Recipe) => a.dateAdded.localeCompare(b.dateAdded));
    } else if (sortOrderDate === 'desc') {
      currentRecipes.sort((a: Recipe, b: Recipe) => b.dateAdded.localeCompare(a.dateAdded));
    } 
    
    if (sortOrderName === 'asc') {
      currentRecipes.sort((a: Recipe, b: Recipe) => a.name.localeCompare(b.name));
    } else if (sortOrderName === 'desc') {
      currentRecipes.sort((a: Recipe, b: Recipe) => b.name.localeCompare(a.name));
    }

    return currentRecipes;

  }, [recipeItems, sortOrderTitle, sortOrderDate, sortOrderName, filterFavorite, searchText]);

  const favoriteRecipe = (title: string) => {
    setRecipeItems((prevRecipe: Recipe[]) => prevRecipe.map((recipe: Recipe) => recipe.title === title ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe))
  }

  const clearFilter = () => {
    setSearchText('');
    setSortOrderTitle('select');
    setSortOrderDate('select');
    setSortOrderName('select');
    setFilterFavorite('');
  }

  const addRecipe = (newRecipe: Recipe) => {

    setRecipeItems((prevRecipes: Recipe[]) => [...prevRecipes, { ...newRecipe }]);
    setView('list');

    setToastMessage('Recipe added successfully!');
    setToastType('success');
    setShowToast(true);
  }

  const updateRecipe = (updatedRecipe: Recipe) => {

    setRecipeItems((prevRecipes: Recipe[]) =>
      prevRecipes.map((recipe: Recipe) => recipe.name === updatedRecipe.name ? updatedRecipe : recipe
      ));

    setView('list');

    setToastMessage('Recipe updated successfully!');
    setToastType('success');
    setShowToast(true);
  }

  const deleteRecipe = async (name: string, imageUrl: string) => {
    try {
      const response = await fetch(`/api/upload?imageUrl=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete image on server:', errorData.message);

        return;
      }
      console.log('Image deleted success');

      setRecipeItems((prevRecipes: Recipe[]) =>
        prevRecipes.filter((recipe: Recipe) => recipe.name !== name)
      );

      setView('list');

      setToastMessage('Recipe deleted successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Network error during image deletion:', error);
      return;
    }


  }

  return (
    <>
      <main>
        <header className={`d-flex flex-wrap justify-content-end p-3 border-bottom sticky-top ${styles.header}`}>
          <div className='col-3 ml-auto'>
            {view === 'list' && <input
              type="search"
              className='form-control w-100'
              placeholder="Search here"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />}
          </div>
        </header>
        {view === 'list' && <RecipeList
          filteredRecipeItems={filteredRecipeItems}
          setSelectedItem={setSelectedItem}
          setView={setView}
          sortOrderTitle={sortOrderTitle}
          setSortOrderTitle={setSortOrderTitle}
          sortOrderDate={sortOrderDate}
          setSortOrderDate={setSortOrderDate}
          sortOrderName={sortOrderName}
          setSortOrderName={setSortOrderName}
          favoriteRecipe={favoriteRecipe}
          setFilterFavorite={setFilterFavorite}
          filterFavorite={filterFavorite}
          searchText={searchText}
          setSearchText={setSearchText}
          clearFilter={clearFilter}
          onEdit={(recipe: Recipe) => { setSelectedItem(recipe); setView('edit'); }}
        />}
        {view === 'add' && <RecipeForm onSubmit={addRecipe} goBack={() => setView('list')} onDelete={deleteRecipe} currentRecipeItems={recipeItems} />}
        {view === 'edit' && selectedItem && <RecipeForm onSubmit={updateRecipe} loadData={selectedItem} editMode={true} goBack={() => setView('list')} onDelete={deleteRecipe} currentRecipeItems={recipeItems} />}
      </main>
      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 start-0 mx-auto p-3" style={{ zIndex: 1100 }}>
          <div className={`toast show align-items-center text-white bg-${toastType} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                {toastMessage}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
