import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Moon, Sun, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

export default function Parametres() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [profile, setProfile] = useState({
    nom: 'Jean Dupont',
    entreprise: 'Courtier Pro Flow',
    email: 'jean.dupont@courtier.com',
    telephone: '06 12 34 56 78',
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      nom: 'Jean Dupont',
      email: 'jean.dupont@courtier.com',
      role: 'administrateur',
      statut: 'actif',
    },
    {
      id: 2,
      nom: 'Marie Martin',
      email: 'marie.martin@courtier.com',
      role: 'courtier',
      statut: 'actif',
    },
    {
      id: 3,
      nom: 'Pierre Bernard',
      email: 'pierre.bernard@courtier.com',
      role: 'courtier',
      statut: 'inactif',
    },
  ]);

  const [openUserDialog, setOpenUserDialog] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations ont été sauvegardées',
    });
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Utilisateur ajouté',
      description: 'L\'utilisateur a été ajouté avec succès',
    });
    setOpenUserDialog(false);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: 'Utilisateur supprimé',
      description: 'L\'utilisateur a été supprimé',
    });
  };

  const handleToggleTheme = () => {
    toggleTheme();
    toast({
      title: 'Thème changé',
      description: `Thème ${theme === 'dark' ? 'clair' : 'sombre'} activé`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez votre profil et vos préférences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations de profil</CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <Button type="button" variant="outline">Changer le logo</Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG ou GIF (max. 2MB)
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom complet</Label>
                    <Input
                      id="nom"
                      value={profile.nom}
                      onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entreprise">Entreprise</Label>
                    <Input
                      id="entreprise"
                      value={profile.entreprise}
                      onChange={(e) => setProfile({ ...profile, entreprise: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={profile.telephone}
                      onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Enregistrer</Button>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Utilisateurs */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>
                    Gérez les utilisateurs de votre compte
                  </CardDescription>
                </div>
                <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un utilisateur
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvel utilisateur</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user_nom">Nom complet</Label>
                        <Input id="user_nom" name="user_nom" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user_email">Email</Label>
                        <Input id="user_email" name="user_email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user_role">Rôle</Label>
                        <Select name="user_role" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrateur">Administrateur</SelectItem>
                            <SelectItem value="courtier">Courtier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">Ajouter</Button>
                        <Button type="button" variant="outline" onClick={() => setOpenUserDialog(false)}>
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nom}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.statut === 'actif' ? 'default' : 'secondary'}>
                          {user.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'affichage</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Thème</Label>
                  <p className="text-sm text-muted-foreground">
                    Choisissez entre le thème clair ou sombre
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => {
                      if (theme === 'dark') handleToggleTheme();
                    }}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Clair
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => {
                      if (theme === 'light') handleToggleTheme();
                    }}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Sombre
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
