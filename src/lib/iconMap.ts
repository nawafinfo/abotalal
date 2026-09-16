import {
  Home, Users, Calendar, Phone, Bot, Bell, MessageCircle, Menu, Sparkles,
  Star, Heart, Gift, Crown, Package, Smartphone, Radio, Wifi, Brain, Image,
  ShoppingBag, Briefcase, Globe, Mail, MapPin, Settings, Info, Zap, Award,
  Camera, Video, Music, BookOpen, LifeBuoy, Rocket, Layers, Link as LinkIcon,
  Facebook, ShieldCheck, Shield, AlertTriangle, Lock, Bug, Cpu, Server,
  Terminal, Key, Newspaper, Router, Fingerprint, Eye, Database, Send,
} from 'lucide-react';

export const ICONS = {
  Home, Users, Calendar, Phone, Bot, Bell, MessageCircle, Menu, Sparkles,
  Star, Heart, Gift, Crown, Package, Smartphone, Radio, Wifi, Brain, Image,
  ShoppingBag, Briefcase, Globe, Mail, MapPin, Settings, Info, Zap, Award,
  Camera, Video, Music, BookOpen, LifeBuoy, Rocket, Layers, LinkIcon,
  Facebook, ShieldCheck, Shield, AlertTriangle, Lock, Bug, Cpu, Server,
  Terminal, Key, Newspaper, Router, Fingerprint, Eye, Database, Send,
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
export const getIcon = (name?: string) => ICONS[(name as IconName)] || Sparkles;
