import { Injectable } from '@angular/core';
import * as simpleIcons from 'simple-icons';

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

  // Mapping technology names to Simple Icons slugs and brand colors
  private iconMap: { [key: string]: { slug: string; color: string } } = {
    // Frontend
    'HTML': { slug: 'html5', color: '#E34F26' },
    'HTML5': { slug: 'html5', color: '#E34F26' },
    'CSS': { slug: 'css3', color: '#1572B6' },
    'CSS3': { slug: 'css3', color: '#1572B6' },
    'Angular': { slug: 'angular', color: '#DD0031' },
    'Tailwind CSS': { slug: 'tailwindcss', color: '#06B6D4' },
    'Tailwind': { slug: 'tailwindcss', color: '#06B6D4' },

    // Backend
    'NodeJS': { slug: 'nodedotjs', color: '#339933' },
    'Node.js': { slug: 'nodedotjs', color: '#339933' },
    'Express': { slug: 'express', color: '#000000' },
    'Spring Boot': { slug: 'springboot', color: '#6DB33F' },
    'Spring': { slug: 'springboot', color: '#6DB33F' },

    // Database
    'MongoDB': { slug: 'mongodb', color: '#47A248' },
    'PostgreSQL': { slug: 'postgresql', color: '#4169E1' },
    'H2-console': { slug: 'h2database', color: '#1BA37A' },
    'H2': { slug: 'h2database', color: '#1BA37A' },

    // Tools
    'Git': { slug: 'git', color: '#F05032' },
    'Docker': { slug: 'docker', color: '#2496ED' },
    'AWS': { slug: 'amazonwebservices', color: '#232F3E' },
    'Amazon Web Services': { slug: 'amazonwebservices', color: '#232F3E' },

    // Other Technologies
    'LibGDX': { slug: 'libgdx', color: '#E74C3C' },
    'JavaFX': { slug: 'javafx', color: '#ED8B00' },
    'Thymeleaf': { slug: 'thymeleaf', color: '#005F0F' },
    'Unit Testing': { slug: 'testinglibrary', color: '#E33332' },
    'Data Visualization': { slug: 'd3dotjs', color: '#F9A03C' },
    'Performance Optimization': { slug: 'webpack', color: '#8DD6F9' }
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
      // Try to get the icon from simple-icons package
      const simpleIcon = (simpleIcons as any)[iconInfo.slug];

      if (simpleIcon) {
        // Use the actual SVG from simple-icons
        const svg = simpleIcon.svg;
        // Add proper attributes and ensure proper color
        const coloredSvg = svg.replace(/fill="#[^"]*"/g, `fill="${iconInfo.color}"`)
                              .replace(/fill='#[^']*'/g, `fill="${iconInfo.color}"`);

        iconData = {
          svg: coloredSvg,
          color: iconInfo.color,
          title: techName
        };
      } else {
        // Fallback to placeholder if simple-icons doesn't have the icon
        console.warn(`Simple icon not found for: ${iconInfo.slug}`);
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
   * Create a placeholder SVG when simple-icons fails
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
