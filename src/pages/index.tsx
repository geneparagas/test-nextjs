import React, { useEffect, useState, useMemo } from 'react';
import Head from 'next/head'
import RecipeForm, { Recipe } from '@/components/Form';
import RecipeList from '@/components/List';
import RecipeDetails from '@/components/Details';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [view, setView] = useState<'list' | 'add' | 'view' | 'edit'>('list');
  const [recipeItems, setRecipeItems] = useState<Recipe[]>([]);

  const [selectedItem, setSelectedItem] = useState<Recipe | null>(null);
  const [sortOrderTitle, setSortOrderTitle] = useState<'asc' | 'desc' | 'select'>('select');
  const [filterFavorite, setFilterFavorite] = useState<'' | 'yes' | 'no'>('');
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    if (recipeItems.length === 0) return

    localStorage.setItem('recipes', JSON.stringify(recipeItems))
  }, [recipeItems]);

  useEffect(() => {
    console.log('testing', searchText)
  }, [searchText]);

  useEffect(() => {
    const storeData = localStorage.getItem('recipes');

    console.log('storeData', storeData)

    const value = storeData ? JSON.parse(storeData) : [
      {
        name: 'Gene Paragas',
        title: 'adobong manok',
        image: '/images/adobo.jpg'
      }
    ]

    setRecipeItems(value);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { id, value, type } = e.target;
          console.log('value', value)
      };

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

    return currentRecipes;

  }, [recipeItems, sortOrderTitle, filterFavorite, searchText]);

  const favoriteRecipe = (title: string) => {
    setRecipeItems((prevRecipe: Recipe[]) => prevRecipe.map((recipe: Recipe) => recipe.title === title ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe))
  }

  const addRecipe = (newRecipe: Recipe) => {

    setRecipeItems((prevRecipes: Recipe[]) => [...prevRecipes, { ...newRecipe }]);
    setView('list');
  }

  const updateRecipe = (updatedRecipe: Recipe) => {

    setRecipeItems((prevRecipes: Recipe[]) =>
      prevRecipes.map((recipe: Recipe) => recipe.name === updatedRecipe.name ? updatedRecipe : recipe
      ));
    setView('list');
  }

  const deleteRecipe = (name: string) => {

    setRecipeItems((prevRecipes: Recipe[]) =>
      prevRecipes.filter((recipe: Recipe) => recipe.name !== name)
    );

    setView('list');
  }

  return (
    <>
      <Head>
        <header className="d-flex flex-wrap justify-content-center py-3 border-bottom">
          Header2
          <input
            type="search"
            className='form-control'
            placeholder="Search here"
            value={searchText}
            onChange={(e) => {console.log(e);setSearchText(e.target.value)}}
          />
        </header>
      </Head>
      <main>
        {view === 'list' && <RecipeList
          filteredRecipeItems={filteredRecipeItems}
          setSelectedItem={setSelectedItem}
          setView={setView}
          setSortOrderTitle={setSortOrderTitle}
          favoriteRecipe={favoriteRecipe}
          setFilterFavorite={setFilterFavorite}
          filterFavorite={filterFavorite}
          searchText={searchText}
          setSearchText={setSearchText}
        />}
        {view === 'add' && <RecipeForm onSubmit={addRecipe} />}
        {view === 'view' && <RecipeDetails recipe={selectedItem} onEdit={(recipe: Recipe) => { setSelectedItem(recipe); setView('edit'); }} onDelete={deleteRecipe} />}
        {view === 'edit' && selectedItem && <RecipeForm onSubmit={updateRecipe} loadData={selectedItem} editMode={true} />}
      </main>
    </>
  )
}
