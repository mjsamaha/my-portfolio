import { Injectable } from '@angular/core';
import * as simpleIcons from 'simple-icons';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { 
  FaHtml5, 
  FaAngular, 
  FaNodeJs, 
  FaDocker, 
  FaGitAlt 
} from 'react-icons/fa';
import { 
  SiTailwindcss, 
  SiThymeleaf, 
  SiExpress, 
  SiSpringboot, 
  SiMongodb, 
  SiPostgresql
} from 'react-icons/si';

export interface IconData {
  svg: string;
  color: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconCache: Map<string, IconData> = new Map();

  // Mapping technology names to React Icons components and brand colors
  // For icons not available in React Icons, we'll use simple-icons as fallback
  private iconMap: { [key: string]: { icon?: any; simpleIconSlug?: string; color: string; useSimpleIcon?: boolean } } = {
    // Frontend
    'HTML': { icon: FaHtml5, color: '#E34F26' },
    'HTML5': { icon: FaHtml5, color: '#E34F26' },
    'Angular': { icon: FaAngular, color: '#DD0031' },
    'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
    'Tailwind': { icon: SiTailwindcss, color: '#06B6D4' },
    'Thymeleaf': { icon: SiThymeleaf, color: '#005F0F' },

    // Backend
    'NodeJS': { icon: FaNodeJs, color: '#339933' },
    'Node.js': { icon: FaNodeJs, color: '#339933' },
    'Express': { icon: SiExpress, color: '#000000' },
    'Spring Boot': { icon: SiSpringboot, color: '#6DB33F' },
    'Spring': { icon: SiSpringboot, color: '#6DB33F' },

    // Database
    'MongoDB': { icon: SiMongodb, color: '#47A248' },
    'PostgreSQL': { icon: SiPostgresql, color: '#4169E1' },
    'H2-Console': { simpleIconSlug: 'h2database', color: '#1BA37A', useSimpleIcon: true },
    'H2-console': { simpleIconSlug: 'h2database', color: '#1BA37A', useSimpleIcon: true },
    'H2': { simpleIconSlug: 'h2database', color: '#1BA37A', useSimpleIcon: true },

    // Tools
    'Git': { icon: FaGitAlt, color: '#F05032' },
    'Docker': { icon: FaDocker, color: '#2496ED' },
    'LibGDX': { simpleIconSlug: 'libgdx', color: '#E74C3C', useSimpleIcon: true },
    'JavaFX': { simpleIconSlug: 'javafx', color: '#ED8B00', useSimpleIcon: true }
  };

  /**
   * Get icon data for a technology
   * @param techName Technology name (e.g., "Angular", "Node.js")
   * @returns IconData with SVG path, color, and title
   */
  getIcon(techName: string): IconData {
    // Check cache first
    if (this.iconCache.has(techName)) {
      return this.iconCache.get(techName)!;
    }

    // Get icon info from mapping
    const iconInfo = this.iconMap[techName];

    let iconData: IconData;

    if (iconInfo) {
      // Check if we should use simple-icons (for icons not in React Icons)
      if (iconInfo.useSimpleIcon && iconInfo.simpleIconSlug) {
        try {
          const simpleIcon = (simpleIcons as any)[iconInfo.simpleIconSlug];
          if (simpleIcon && simpleIcon.svg) {
            const svg = simpleIcon.svg.replace(/fill="#[^"]*"/g, `fill="${iconInfo.color}"`)
                                      .replace(/fill='#[^']*'/g, `fill="${iconInfo.color}"`);
            iconData = {
              svg: svg,
              color: iconInfo.color,
              title: techName
            };
          } else {
            iconData = this.createPlaceholderSvg(iconInfo.color, techName);
          }
        } catch (error) {
          console.warn(`Error extracting simple-icon for ${techName}:`, error);
          iconData = this.createPlaceholderSvg(iconInfo.color, techName);
        }
      } else if (iconInfo.icon) {
        // Use React Icons
        try {
          iconData = this.extractSvgFromReactIcon(iconInfo.icon, iconInfo.color, techName);
        } catch (error) {
          console.warn(`Error extracting icon for ${techName}:`, error);
          iconData = this.createPlaceholderSvg(iconInfo.color, techName);
        }
      } else {
        iconData = this.createPlaceholderSvg(iconInfo.color, techName);
      }
    } else {
      // Fallback to generic icon for unmapped technologies
      iconData = this.getFallbackIcon(techName);
    }

    // Cache the result
    this.iconCache.set(techName, iconData);
    return iconData;
  }

  /**
   * Extract SVG from React Icon component using react-dom/server
   * This renders the React component to a string and extracts the SVG
   */
  private extractSvgFromReactIcon(iconComponent: any, color: string, title: string): IconData {
    try {
      // Render the React Icon component to a string
      const iconElement = React.createElement(iconComponent, { 
        color: color,
        size: '1em',
        style: { color: color }
      });
      const svgString = ReactDOMServer.renderToStaticMarkup(iconElement);
      
      // Extract and modify the SVG to ensure proper color
      // React Icons might use currentColor, so we'll replace it with the actual color
      const coloredSvg = svgString
        .replace(/fill="currentColor"/g, `fill="${color}"`)
        .replace(/fill='currentColor'/g, `fill="${color}"`)
        .replace(/stroke="currentColor"/g, `stroke="${color}"`)
        .replace(/stroke='currentColor'/g, `stroke="${color}"`);
      
      return {
        svg: coloredSvg,
        color: color,
        title: title
      };
    } catch (error) {
      console.warn('Failed to extract SVG from React Icon:', error);
      return this.createPlaceholderSvg(color, title);
    }
  }

  /**
   * Create a placeholder SVG when icon extraction fails
   */
  private createPlaceholderSvg(color: string, title: string): IconData {
    const svg = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${title}</title><circle cx="12" cy="12" r="10" fill="${color}" opacity="0.1"/><circle cx="12" cy="12" r="8" fill="none" stroke="${color}" stroke-width="1.5"/><text x="12" y="16" font-size="8" fill="${color}" text-anchor="middle" font-weight="bold">${title.substring(0, 3).toUpperCase()}</text></svg>`;
    return {
      svg: svg,
      color: color,
      title: title
    };
  }

  /**
   * Get fallback icon for technologies completely unmapped
   */
  private getFallbackIcon(techName: string): IconData {
    // Return a generic code icon SVG
    return {
      svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V6C19 4.34315 17.6569 3 16 3H8ZM7 6C7 5.44772 7.44772 5 8 5H16C16.5523 5 17 5.44772 17 6V18C17 18.5523 16.5523 19 16 19H8C7.44772 19 7 18.5523 7 18V6Z" fill="currentColor"/><path d="M10 8L8.70711 9.29289C8.31658 9.68342 8.31658 10.3166 8.70711 10.7071L10 12M14 8L15.2929 9.29289C15.6834 9.68342 15.6834 10.3166 15.2929 10.7071L14 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      color: '#6B7280', // gray-500
      title: techName
    };
  }

  /**
   * Get category color scheme
   */
  getCategoryColor(category: string): { bg: string; border: string; text: string } {
    const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
      'Frontend': {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-900'
      },
      'Backend': {
        bg: 'from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-900'
      },
      'Database': {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-900'
      },
      'Tools & Others': {
        bg: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        text: 'text-orange-900'
      }
    };

    return colorMap[category] || {
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-200',
      text: 'text-gray-900'
    };
  }
}
