import React from 'react';
import { Palette, Type, Layout, Map } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../UI';

export const DesignTab = ({ audit }) => {
  const { typography, colors, ia } = audit || {};

  return (
    <div className="space-y-8">
      {/* Typography Section */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Type className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Typography</h2>
        </div>

        {typography ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Font Families */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Font Families</CardTitle>
              </CardHeader>
              <CardContent>
                {typography.fonts && typography.fonts.length > 0 ? (
                  <div className="space-y-3">
                    {typography.fonts.map((font, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-medium text-gray-900" style={{ fontFamily: font }}>
                          {font}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          The quick brown fox jumps over the lazy dog
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No custom fonts detected. Site may be using browser defaults.</p>
                )}
              </CardContent>
            </Card>

            {/* Font Sizes */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Font Sizes ({typography.allFontSizes?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {typography.allFontSizes && typography.allFontSizes.length > 0 ? (
                  <div className="space-y-2">
                    {typography.allFontSizes.slice(0, 10).map((size, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700" style={{ fontSize: size }}>
                          Example Text
                        </span>
                        <span className="text-sm font-mono text-gray-600">{size}</span>
                      </div>
                    ))}
                    {typography.allFontSizes.length > 10 && (
                      <p className="text-sm text-gray-500 mt-2">
                        + {typography.allFontSizes.length - 10} more sizes
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No font sizes detected.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card hover={false}>
            <CardContent>
              <p className="text-gray-600">Typography data not available.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Color Palette Section */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Palette className="w-6 h-6 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Color Palette</h2>
        </div>

        {colors ? (
          <div className="space-y-6">
            {/* Main Palette */}
            {colors.palette && colors.palette.length > 0 && (
              <Card hover={false}>
                <CardHeader>
                  <CardTitle>Main Colors ({colors.palette.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {colors.palette.map((color, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className="w-full h-20 rounded-lg border-2 border-gray-200 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <div className="text-xs text-gray-600 font-mono text-center break-all">
                          {color}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Color Categories */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Background Colors */}
              {colors.backgroundColors && colors.backgroundColors.length > 0 && (
                <Card hover={false}>
                  <CardHeader>
                    <CardTitle>Backgrounds ({colors.backgroundColors.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.backgroundColors.slice(0, 8).map((color, index) => (
                        <div key={index} className="space-y-1">
                          <div
                            className="w-full h-12 rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                          <div className="text-xs text-gray-600 font-mono text-center truncate">
                            {color}
                          </div>
                        </div>
                      ))}
                    </div>
                    {colors.backgroundColors.length > 8 && (
                      <p className="text-xs text-gray-500 mt-2">
                        + {colors.backgroundColors.length - 8} more
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Text Colors */}
              {colors.textColors && colors.textColors.length > 0 && (
                <Card hover={false}>
                  <CardHeader>
                    <CardTitle>Text Colors ({colors.textColors.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {colors.textColors.slice(0, 5).map((color, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm font-mono text-gray-700">{color}</span>
                        </div>
                      ))}
                      {colors.textColors.length > 5 && (
                        <p className="text-xs text-gray-500 mt-2">
                          + {colors.textColors.length - 5} more
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Border Colors */}
              {colors.borderColors && colors.borderColors.length > 0 && (
                <Card hover={false}>
                  <CardHeader>
                    <CardTitle>Border Colors ({colors.borderColors.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {colors.borderColors.slice(0, 5).map((color, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded border-2 flex-shrink-0"
                            style={{ borderColor: color, backgroundColor: 'white' }}
                          />
                          <span className="text-sm font-mono text-gray-700">{color}</span>
                        </div>
                      ))}
                      {colors.borderColors.length > 5 && (
                        <p className="text-xs text-gray-500 mt-2">
                          + {colors.borderColors.length - 5} more
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Total Unique Colors */}
            <Card hover={false}>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {colors.totalUniqueColors || colors.palette?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Unique Colors</div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card hover={false}>
            <CardContent>
              <p className="text-gray-600">Color palette data not available.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Information Architecture Section */}
      <section>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Map className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Information Architecture</h2>
        </div>

        {ia ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Site Structure */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Site Structure</CardTitle>
              </CardHeader>
              <CardContent>
                {ia.home ? (
                  <div className="space-y-2">
                    <SiteMapNode node={ia.home} level={0} />
                  </div>
                ) : (
                  <p className="text-gray-600">Navigation structure not available.</p>
                )}
              </CardContent>
            </Card>

            {/* IA Metrics */}
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Navigation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Navigation Depth</span>
                    <span className="text-2xl font-bold text-gray-900">{ia.depth || 0} levels</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Total Pages</span>
                    <span className="text-2xl font-bold text-gray-900">{ia.pageCount || ia.totalPages || 0}</span>
                  </div>
                  {ia.complexity && (
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-700 font-medium">Complexity</span>
                      <span className="text-lg font-semibold text-gray-900 capitalize">{ia.complexity}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card hover={false}>
            <CardContent>
              <p className="text-gray-600">Information architecture data not available.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Layout & Spacing */}
      {audit?.spacing && (
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Layout className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Layout & Spacing</h2>
          </div>

          <Card hover={false}>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {audit.spacing.margins && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Margins</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {audit.spacing.margins.slice(0, 5).map((margin, idx) => (
                        <div key={idx}>{margin}</div>
                      ))}
                    </div>
                  </div>
                )}
                {audit.spacing.paddings && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Paddings</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {audit.spacing.paddings.slice(0, 5).map((padding, idx) => (
                        <div key={idx}>{padding}</div>
                      ))}
                    </div>
                  </div>
                )}
                {audit.spacing.gaps && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Gaps</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {audit.spacing.gaps.slice(0, 5).map((gap, idx) => (
                        <div key={idx}>{gap}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

const SiteMapNode = ({ node, level }) => {
  const indent = level * 20;

  return (
    <>
      <div
        className="flex items-center space-x-2 py-1"
        style={{ marginLeft: `${indent}px` }}
      >
        {level > 0 && (
          <span className="text-gray-400">{'└─'}</span>
        )}
        <span className={`${level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {node.name}
        </span>
      </div>
      {node.children && node.children.map((child, index) => (
        <SiteMapNode key={index} node={child} level={level + 1} />
      ))}
    </>
  );
};
