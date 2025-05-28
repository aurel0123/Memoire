import { ChevronRight, BookOpen, Vote, Calendar, CreditCard, CheckCircle, Menu, X } from 'lucide-react';
import Dashboard from "@/assets/images/Dashboard.png";

export default function HeroSection() {
  return (
    <>
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 ">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight mb-4">
              Simplifiez la gestion universitaire grâce au numérique
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Une plateforme innovante conçue pour Pigier Bénin qui automatise les
              soutenances, facilite les votes en ligne et optimise la gestion des
              salles.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#fonctionnalites"
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Découvrir la plateforme
                <ChevronRight size={20} className="ml-2" />
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-md transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <img
                src={Dashboard}
                alt="Dashboard de la plateforme Pigier Bénin Digital"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="problematique" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">La problématique</h2>
            <p className="text-lg text-gray-600">
              Avant la mise en place de notre solution, Pigier Bénin rencontrait plusieurs défis dans la gestion administrative quotidienne.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestion manuelle</h3>
              <p className="text-gray-600">
                Processus administratifs chronophages et sujets aux erreurs humaines lors de la planification des soutenances et des salles.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lenteur administrative</h3>
              <p className="text-gray-600">
                Délais importants pour l&apos;organisation des votes et la validation des résultats académiques affectant l&apos;expérience des étudiants.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi complexe</h3>
              <p className="text-gray-600">
                Difficulté à suivre les paiements et à coordonner efficacement les disponibilités des salles et des intervenants.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="solutions" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Nos solutions</h2>
            <p className="text-lg text-gray-600">
              Nous avons développé une plateforme intégrée qui répond à tous ces défis en digitalisant l&apos;ensemble des processus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Automatisation complète</h3>
                <p className="text-gray-600">
                  La plateforme automatise l&apos;ensemble du processus de soutenances, de la planification à l&apos;évaluation, 
                  en passant par la notification des participants.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Vote numérique sécurisé</h3>
                <p className="text-gray-600">
                  Un système de vote en ligne transparent et sécurisé pour les élections de délégués et les décisions collectives.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Gestion optimisée des ressources</h3>
                <p className="text-gray-600">
                  Un calendrier interactif pour la réservation des salles et la coordination des disponibilités des enseignants et jurys.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Paiements fluides et sécurisés</h3>
                <p className="text-gray-600">
                  Intégration de l&apos;API KKIAPAY pour assurer des transactions financières sécurisées et un suivi en temps réel des paiements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section */}
      <section id="fonctionnalites" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Fonctionnalités clés</h2>
            <p className="text-lg text-gray-600">
              Notre plateforme offre des outils puissants pour simplifier la gestion universitaire.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <BookOpen size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Gestion des soutenances</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Planification automatisée
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Affectation des jurys
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Suivi des évaluations
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Vote size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Vote en ligne</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Élections sécurisées
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Résultats en temps réel
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Transparence totale
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Calendar size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Réservation de salles</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Calendrier interactif
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Gestion des conflits
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Notification automatique
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <CreditCard size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Paiements sécurisés</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Intégration KKIAPAY
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Suivi des transactions
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Reçus automatiques
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section id="technologies" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Technologies utilisées</h2>
            <p className="text-lg text-gray-600">
              Notre plateforme s'appuie sur des technologies modernes et robustes pour assurer performance et fiabilité.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-24 mb-4">
                <div className="bg-blue-600 text-white font-bold rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">R</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">React</h3>
              <p className="text-gray-600">
                Interface utilisateur dynamique et réactive pour une expérience fluide côté client.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-24 mb-4">
                <div className="bg-green-600 text-white font-bold rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">D</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Django</h3>
              <p className="text-gray-600">
                Backend robuste et sécurisé, garantissant l'intégrité des données et la performance du système.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-24 mb-4">
                <div className="bg-yellow-500 text-white font-bold rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">K</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">KKIAPAY</h3>
              <p className="text-gray-600">
                Solution de paiement africaine sécurisée pour les transactions financières en ligne adaptées au contexte local.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à transformer votre gestion universitaire ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez les institutions qui ont déjà fait le pas vers la digitalisation de leurs processus académiques.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-md transition-colors">
              Demander une démo
            </button>
            <button className="border border-white hover:bg-blue-700 font-medium py-3 px-8 rounded-md transition-colors">
              Télécharger la brochure
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white font-bold rounded-md p-2">PB</div>
                <span className="text-xl font-bold text-white">Pigier Bénin Digital</span>
              </div>
              <p className="mb-4">
                Une solution développée pour optimiser la gestion universitaire à Pigier Bénin.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Accueil</a></li>
                <li><a href="#problematique" className="hover:text-white transition-colors">Problématique</a></li>
                <li><a href="#solutions" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#technologies" className="hover:text-white transition-colors">Technologies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Informations</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">À propos de Pigier Bénin</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 mt-0.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Carré 384 Jericho, 03 BP 2049, Cotonou, Bénin</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 mt-0.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>contact@pigier-benin.com</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-5 h-5 mt-0.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>+229 21 32 45 87</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>© {new Date().getFullYear()} Pigier Bénin Digital. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
    
  );
}
