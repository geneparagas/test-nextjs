import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import RecipeForm, { Recipe } from '@/components/Form';
import RecipeList from '@/components/List';
import RecipeDetails from '@/components/Details';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [view, setView] = useState<'list' | 'add' | 'view' | 'edit'>('list');
  const [recipeItems, setRecipeItems] = useState<Recipe[]>([]);

  const [selectedItem, setSelectedItem] = useState<Recipe | null>(null);

  useEffect(() => {
    if (recipeItems.length === 0) return

    localStorage.setItem('recipes', JSON.stringify(recipeItems))
  }, [recipeItems]);

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

  const addRecipe = (newRecipe: Recipe) => {

    setRecipeItems((prevRecipes: Recipe[]) => [...prevRecipes, {...newRecipe}]);
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
          Header 
        </header>
      </Head>
      <main>
        {view === 'list' && <RecipeList recipeItems={recipeItems} setSelectedItem={setSelectedItem} setView={setView} />}
        {view === 'add' && <RecipeForm onSubmit={addRecipe} />}
        {view === 'view' && <RecipeDetails recipe={selectedItem} onEdit={(recipe: Recipe) => {setSelectedItem(recipe); setView('edit'); }} onDelete={deleteRecipe} />}
        {view === 'edit' && selectedItem && <RecipeForm onSubmit={updateRecipe} loadData={selectedItem} editMode={true} />}
      </main>
    </>
  )
}
