import { useState, useContext, useEffect, useMemo } from 'react';
import { GraduationCap, Menu } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from './ui/navigation-menu';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Accordion } from './ui/accordion';
import AuthContext from '@/context/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';

export default function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  
  // Configuration statique
  const logo = {
    url: "/",
    icon: GraduationCap,
    alt: "logo",
    title: "Logo",
  };

  const menuItems = [
    { title: "Home", url: "/" },
    { title: "A propos", url: "/about" },
    { title: "Soutenance", url: "/soutenance" },
    { title: "Evènements", url: "/home-events" }
  ];

  const contact = { title: "Contact", url: "/contact" };
  
  const authOptions = {
    title: "Démarrer",
    items: [
      { title: "Organisateur", url: "/connexion" },
      { title: "Gérer vos soutenances", url: "/manage" }
    ]
  };

  // Calcul des initiales
  const initials = useMemo(() => {
    if (!profile?.nom || !profile?.prenom) return '';
    return `${profile.nom.charAt(0)}${profile.prenom.charAt(0)}`.toUpperCase();
  }, [profile]);

  // Formatage du type d'utilisateur
  const userTypeFormatted = useMemo(() => {
    if (!profile?.type_user) return '';
    return profile.type_user.charAt(0).toUpperCase() + profile.type_user.slice(1).toLowerCase();
  }, [profile]);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  // Rendu conditionnel du menu utilisateur
  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-10 w-10 overflow-hidden">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{userTypeFormatted}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/events">Mes évènements</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard">Dashbaord</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">Paramètres</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser}>
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Rendu conditionnel du menu d'authentification
  const renderAuthMenu = () => (
    <div className="flex gap-4">
      <Button asChild variant="link" size="sm">
        <Link to={contact.url}>{contact.title}</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="gradiant-color">
            {authOptions.title}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Créer votre compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {authOptions.items.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link to={item.url}>{item.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <section className='py-1 shadow-accent'>
      <div className='container h-16'>
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex w-full">
          <div className="flex items-center gap-6">
            <Link to={logo.url} className="flex items-center gap-2">
              <logo.icon size={30} className="max-h-10 text-blue-900" />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link to={item.url}>{item.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {profile ? renderUserMenu() : renderAuthMenu()}
        </nav>

        {/* Mobile Menu */}
        <nav className='block lg:hidden w-full'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Sheet className='z-30'>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className='size-4' />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto" side='left'>
                  <SheetHeader>
                    <SheetTitle>
                      <Link to={logo.url} className="flex items-center gap-2">
                        <logo.icon size={30} className="max-h-10 text-blue-900" />
                        <span className="text-lg font-semibold tracking-tighter">
                          {logo.title}
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion type="single" collapsible className='flex flex-col w-full gap-4'>
                      {menuItems.map((item) => (
                        <Link key={item.title} to={item.url} className="text-md font-semibold">
                          {item.title}
                        </Link>
                      ))}
                    </Accordion>
                    <Button asChild variant="link" size="sm">
                      <Link to={contact.url}>{contact.title}</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              <Link to={logo.url} className="flex items-center gap-2">
                <logo.icon size={30} className="max-h-10 text-blue-900" />
              </Link>
            </div>
            {!profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="gradiant-color">
                    {authOptions.title}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Créer votre compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {authOptions.items.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link to={item.url}>{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
			{profile && renderUserMenu() }
          </div>
        </nav>
      </div>
    </section>
  );
}